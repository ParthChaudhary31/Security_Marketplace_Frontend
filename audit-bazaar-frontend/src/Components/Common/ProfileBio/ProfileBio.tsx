import "./ProfileBio.scss";
import defaultUserIcon from "../../../Assets/Images/defaultUserIcon.png"
import pointImg from "../../../Assets/Images/point-img.jpg";
import social_img from "../../../Assets/Images/Icons/git-hub.svg";
import social_img2 from "../../../Assets/Images/Icons/linkndin.svg";
import social_img3 from "../../../Assets/Images/Icons/telegram.svg";
import ButtonCustom from "../Button/ButtonCustom";
import TextArea from "../FormInputs/TextArea";
import { useSelector } from "react-redux";
import { UserData } from "../../../Constants/Interfaces/Authentication/UserData";
import { useState } from "react";
import ChangePassword from "../ChangePassword/ChangePassword";

const ProfileBio = () => {
  const userData: UserData = useSelector((state: any) => state?.userDataSlice);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);

  const socialdata = [
    {
      social_img: social_img,
      link: "GitHub",
      className: "blue1",
    },
    {
      social_img: social_img2,
      link: "LinkedIn",
      className: "blue2",
    },
    {
      social_img: social_img3,
      link: "Telegram",
      className: "blue3",
    },
  ];

  //Fn HANDLE PASSWORD
  const handlePasswordModal = () => {
    setShowPasswordModal(true);
  }

  return (
    <>
      <div className="profileBio">
        <div className="profileBio_header">
          <div className="profileBio_header_info">
            <div className="list_image">
              <img src={defaultUserIcon} alt="list-img" />
            </div>
            <div className="list_content">
              <h6>
                {userData?.firstName} {userData?.lastName}
              </h6>
              <p className="user_email">{userData.emailAddress}</p>
            </div>
          </div>
        </div>
        <div className="profileBio_link">
          <TextArea
            label="Profile Bio"
            name="message"
            value={userData?.bio}
          />
        </div>
        <div className="profileBio_pointImg">
          <img src={pointImg} alt="point-img" />
        </div>
        <div className="profileBio_link">
          <h6>Social Accounts</h6>
          <div className="profileBio_link_info">
            <div className="profileBio_link_info_social">
              {socialdata.map((item) => {
                return (
                  <div className="social_account">
                    <div className="social_img">
                      <img src={item.social_img} alt="social-img" />
                    </div>
                    <a
                      target="_blank"
                      href={
                        item.link === "GitHub"
                          ? userData?.gitHub
                          : item.link === "LinkedIn"
                            ? userData?.linkedIn
                            : item.link === "Telegram"
                              ? userData?.telegram
                              : ""
                      }
                      className={item.className}
                    >
                      {item.link}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ButtonCustom
          title="Change Password"
          type="submit"
          className="bordered mw-100"
          onClick={() => handlePasswordModal()}
        />
      </div>
      <ChangePassword show={showPasswordModal} />
    </>

  );
};

export default ProfileBio;
