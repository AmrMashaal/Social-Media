import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { userId } = useParams();
  return <div>Profile: {userId}</div>;
};

export default ProfilePage;
