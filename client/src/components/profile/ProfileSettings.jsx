/* eslint-disable react/prop-types */
import { Formik } from "formik";
import TasksComponent from "../TasksComponent";
import * as yup from "yup";
import {
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Dropzone from "react-dropzone";
import EditOutLinedIcon from "@mui/icons-material/EditOutlined";
import { countries, occupations } from "../../../infoArrays";
import { Box, useTheme } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../../state";
import { useState } from "react";
import FlexBetween from "../FlexBetween";

const ProfileSettings = ({ setProfileSettings, setChangePassword }) => {
  const [usernameError, setUsernameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const mode = useSelector((state) => state.mode);

  const dispatch = useDispatch();

  const { palette } = useTheme();

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    bio: user.bio,
    location: user.location,
    occupation: user.occupation,
    background: "",
    picturePath: "",
  };

  const schema = yup.object({
    firstName: yup
      .string()
      .min(2)
      .max(20)
      .matches(/^\p{L}+(\s\p{L}+)*$/u, "You can just add alphabetic characters")
      .required("required"),
    lastName: yup
      .string()
      .min(2)
      .max(20)
      .matches(/^\p{L}+(\s\p{L}+)*$/u, "You can just add alphabetic characters")
      .required("required"),
    username: yup.string().min(2).max(20).required("required"),
    bio: yup.string().max(400),
    location: yup.string().required("Please select a location"),
    occupation: yup.string().required("Please select a location"),
    background: yup
      .mixed()
      .notRequired()
      .test("fileType", "Unsupported file format", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/webp"].includes(value.type))
        );
      }),
    picturePath: yup
      .mixed()
      .notRequired()
      .test("fileType", "Unsupported file format", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/webp"].includes(value.type))
        );
      }),
  });

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("username", values.username);
    formData.append("bio", values.bio);
    formData.append("location", values.location);
    formData.append("occupation", values.occupation);

    if (values.background) {
      formData.append("picture", values.background);
      formData.append("background", values.background.name);
    } else if (values.picturePath) {
      formData.append("picture", values.picturePath);
      formData.append("picturePath", values.picturePath.name);
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}/${
          user.username
        }/edit`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        dispatch(setLogin({ user: data, token: token }));
        setUsernameError(false);
      } else if (data.message) {
        setUsernameError(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TasksComponent
      open={ProfileSettings}
      setOpen={setProfileSettings}
      description="Edit Profile"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => {
          return (
            <form
              style={{ display: "flex", flexDirection: "column", gap: "22px" }}
              onSubmit={handleSubmit}
            >
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{
                  gridColumn: "span 2",
                }}
              />
              <TextField
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{
                  gridColumn: "span 2",
                }}
              />
              <TextField
                label="Username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={Boolean(touched.username) && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              {usernameError && (
                <Typography
                  color="error"
                  m="-19px 0 -2px 0"
                  fontSize="12px"
                  whiteSpace="nowrap"
                >
                  the username is already existed
                </Typography>
              )}
              <TextField
                label="Bio"
                multiline
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bio}
                name="bio"
                error={Boolean(touched.bio) && Boolean(errors.bio)}
                helperText={touched.bio && errors.bio}
                sx={{
                  gridColumn: "span 4",
                }}
              />
              <InputLabel id="location-lable" sx={{ mb: "-20px" }}>
                Location
              </InputLabel>
              <Select
                name="location"
                displayEmpty
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.location) && Boolean(errors.location)}
                labelId="location-lable"
              >
                <MenuItem value="">Select a location</MenuItem>
                {countries.map((country) => {
                  return (
                    <MenuItem value={country} key={country}>
                      {country}
                    </MenuItem>
                  );
                })}
              </Select>
              {Boolean(touched.location) && Boolean(errors.location) && (
                <Typography
                  color="error"
                  m="-19px 0 -20px 0"
                  fontSize="12px"
                  whiteSpace="nowrap"
                >
                  {errors.location}
                </Typography>
              )}

              <InputLabel id="occupation-lable" sx={{ mb: "-20px" }}>
                Occupation
              </InputLabel>

              <Select
                name="occupation"
                displayEmpty
                value={values.occupation}
                onChange={handleChange}
                onBlur={handleBlur}
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                labelId="occupation-lable"
              >
                <MenuItem value="">Select a occupation</MenuItem>
                {occupations.map((occupation) => {
                  return (
                    <MenuItem value={occupation} key={occupation}>
                      {occupation}
                    </MenuItem>
                  );
                })}
              </Select>
              {Boolean(touched.occupation) && Boolean(errors.occupation) && (
                <Typography
                  color="error"
                  m="-19px 0 -20px 0"
                  fontSize="12px"
                  whiteSpace="nowrap"
                >
                  {errors.occupation}
                </Typography>
              )}

              {/* -----------------Dropzone1----------------- */}

              <InputLabel sx={{ mb: "-20px" }}>Profile Picture</InputLabel>

              <Box
                border={`2px solid ${palette.neutral.medium}`}
                padding="1rem"
                sx={{
                  gridColumn: "span 4",
                  borderRadius: "4px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <Dropzone
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    setFieldValue("picturePath", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      padding="1rem"
                    >
                      <input {...getInputProps()} />
                      {!values.picturePath ? (
                        <p>Add Profile Picture Here</p>
                      ) : (
                        <FlexBetween>
                          <Typography>
                            {values.picturePath.name.length > 30
                              ? `${
                                  values.picturePath.name.slice(0, 30) + "..."
                                }`
                              : values.picturePath.name}
                          </Typography>
                          <IconButton>
                            <EditOutLinedIcon />
                          </IconButton>
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
              {touched.picturePath && errors.picturePath && (
                <Typography color="error" variant="body2" m="-10px 0 -20px 0">
                  {errors.picturePath}
                </Typography>
              )}

              {/* -----------------Dropzone2----------------- */}
              <InputLabel sx={{ mb: "-20px" }}>Background</InputLabel>

              <Box
                border={`2px solid ${palette.neutral.medium}`}
                padding="1rem"
                sx={{
                  gridColumn: "span 4",
                  borderRadius: "4px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <Dropzone
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    setFieldValue("background", acceptedFiles[0]);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      padding="1rem"
                    >
                      <input {...getInputProps()} />
                      {!values.background ? (
                        <p>Add Background Here</p>
                      ) : (
                        <FlexBetween>
                          <Typography>
                            {values.background.name.length > 30
                              ? `${values.background.name.slice(0, 30) + "..."}`
                              : values.background.name}
                          </Typography>
                          <IconButton>
                            <EditOutLinedIcon />
                          </IconButton>
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
              {touched.background && errors.background && (
                <Typography color="error" variant="body2" m="-10px 0 -20px 0">
                  {errors.background}
                </Typography>
              )}

              <Typography
                p="6px 9px"
                border="2px solid #858585"
                width="100%"
                borderRadius="4px"
                textAlign="center"
                sx={{
                  userSelect: "none",
                  cursor: "pointer",
                  transition: ".3s",
                  padding: "10px",
                  mt: "7px",
                  "&:hover": {
                    background: mode === "dark" ? "#0000003b" : "#a5a5a578",
                  },
                }}
                onClick={() => {
                  setProfileSettings(false);
                  setChangePassword(true);
                }}
              >
                Change password
              </Typography>

              {/* -----------------Button----------------- */}

              <Button
                fullWidth
                type="submit"
                sx={{
                  padding: "1rem",
                  mt: "7px",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": {
                    color: palette.primary.main,
                  },
                }}
              >
                {loading ? "loading..." : "Submit"}
              </Button>
            </form>
          );
        }}
      </Formik>
    </TasksComponent>
  );
};

export default ProfileSettings;
