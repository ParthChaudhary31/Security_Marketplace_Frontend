import "./ProfileBio.scss";
import defaultUserIcon from "../../../Assets/Images/defaultUserIcon.png";
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
import { useNavigate } from "react-router-dom";
import { baseUrl, isImageFile } from "../../../Constant";

const ProfileBio = () => {
  const userData: UserData = useSelector((state: any) => state?.userDataSlice);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const navigate = useNavigate();

  const profilePictureUrl =
    baseUrl +
    (userData?.profilePicture && isImageFile(userData?.profilePicture)
      ? userData?.profilePicture
      : "");

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

  const handlePasswordModal = () => {
    setShowPasswordModal(true);
  };
  const updateProfileSetting = () => {
    navigate("/admin/settings");
  };
  return (
    <>
      <div className="profileBio">
        <div className="profileBio_header">
          <div className="profileBio_header_info">
            <div className="list_image">
              <img
                src={
                  profilePictureUrl && isImageFile(profilePictureUrl)
                    ? profilePictureUrl
                    : defaultUserIcon
                }
                alt="user_img"
              />
            </div>

            <div className="list_content">
              <h6>
                {userData?.firstName} {userData?.lastName}
              </h6>
              <p className="user_email">{userData?.emailAddress}</p>
            </div>
          </div>
        </div>
        <div className="profileBio_link">
          <TextArea
            label="Profile Bio"
            disabled
            name="message"
            value={userData?.bio}
          />
        </div>
        <div className="profileBio_pointImg">
          <img src={pointImg} alt="point-img" />
          <div className="profileBio_pointImg_text">
            <h5>XP Points</h5>
            <h3>30</h3>
          </div>
        </div>
        <div className="profileBio_link">
          <h6>Social Accounts</h6>
          <div className="profileBio_link_info">
            <div className="profileBio_link_info_social">
              {socialdata?.map((item,index:any) => {
                const socialLink =
                  item?.link === "GitHub"
                    ? userData?.gitHub
                    : item?.link === "LinkedIn"
                    ? userData?.linkedIn
                    : item?.link === "Telegram"
                    ? userData?.telegram
                    : "";

                return (
                  <div className="social_account" key={index}>
                    <div className="social_img">
                      <img src={item?.social_img} alt="social-img" />
                    </div>
                    {socialLink ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={socialLink}
                        className={item?.className}
                      >
                        {item?.link}
                      </a>
                    ) : (
                      <span className="disabled-link">{item?.link}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <ButtonCustom
          title="Update Profile"
          type="submit"
          className="bordered mw-100"
          onClick={() => updateProfileSetting()}
        />
        <ButtonCustom
          title="Change Password"
          type="submit"
          className="bordered mw-100 mt-4"
          onClick={() => handlePasswordModal()}
        />
      </div>
      <ChangePassword
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default ProfileBio;
