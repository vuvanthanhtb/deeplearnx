import { useAppSelector } from "@/shell/redux/hooks";
import BaseFormComponent from "../../ui/base-form";
import { profileConfig } from "./profile.config";

type ProfileComponentProps = {
  handleClose: () => void;
};

const ProfileComponent: React.FC<ProfileComponentProps> = (props) => {
  const { handleClose } = props;
  const auth = useAppSelector((state) => state.auth);

  return (
    <BaseFormComponent
      formConfig={profileConfig}
      values={{
        name: auth.user?.fullName,
        username: auth.user?.username,
        email: auth.user?.email,
        role: auth.roles.join(", "),
      }}
      handlers={{
        close: handleClose,
      }}
    />
  );
};

export default ProfileComponent;
