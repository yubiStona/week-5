import { useParams } from "react-router-dom";
const User = () => {
  const params = useParams();
  return <div>Hi I am {params.username}</div>;
};

export default User;
