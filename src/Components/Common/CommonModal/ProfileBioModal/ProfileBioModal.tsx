import "./ProfileBioModal.scss";
import pointImg from "../../../../Assets/Images/point-img.jpg";
import social_img from "../../../../Assets/Images/Icons/git-hub.svg";
import social_img2 from "../../../../Assets/Images/Icons/linkndin.svg";
import social_img3 from "../../../../Assets/Images/Icons/telegram.svg";
import CommonModal from "../CommonModal";
import defaultUserIcon from "../../../../Assets/Images/defaultUserIcon.png";

import { baseUrl, isImageFile } from "../../../../Constant";

const ProfileBioModal = (props: any) => {
  const { profileData, confirmBidData } = props;
  const profilePictureUrlForPatron = baseUrl + profileData?.profilePicture;
  const profilePictureUrlForAuditor = baseUrl + confirmBidData?.profilePicture;

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
  return (
    <CommonModal
      show={props?.show}
      onHide={props?.onHide}
      heading="Profile Bio"
      className="profile_bio_modal"
      crossBtn
    >
      <div className="profileBio">
        <div className="profileBio_header">
          <div className="profileBio_header_info">
            {confirmBidData && Object.keys(confirmBidData)?.length > 0 ? (
              <div className="list_image">
                <img
                  src={
                    isImageFile(profilePictureUrlForAuditor)
                      ? profilePictureUrlForAuditor
                      : defaultUserIcon
                  }
                  alt="list-img"
                />
              </div>
            ) : (
              <div className="list_image">
                <img
                  src={
                    isImageFile(profilePictureUrlForPatron)
                      ? profilePictureUrlForPatron
                      : defaultUserIcon
                  }
                  alt="list-img"
                />
              </div>
            )}
            {confirmBidData && Object.keys(confirmBidData)?.length > 0 ? (
              <div className="list_content">
                <h6>
                  {(confirmBidData?.firstName+" "+confirmBidData?.lastName)}
                </h6>
                <p className="user_email">{confirmBidData?.emailAddress}</p>
              </div>
            ) : (
              <div className="list_content">
                <h6>
                  {(profileData?.firstName+" "+profileData?.lastName)}
                </h6>
                <p className="user_email">{profileData?.emailAddress}</p>
              </div>
            )}
          </div>
        </div>
        <div className="profileBio_link">
          <h6>Profile Bio</h6>
          <div className="profileBio_link_info">
            <p>
              {confirmBidData && Object.keys(confirmBidData)?.length > 0
                ? confirmBidData?.bio
                : profileData?.bio}
            </p>
          </div>
        </div>
        <div className="profileBio_pointImg">
          <img src={pointImg} alt="point-img" />
        </div>
        <div className="profileBio_link">
          <h6>Social Accounts</h6>
          <div className="profileBio_link_info">
            <div className="profileBio_link_info_social">
              {socialdata?.map((item:any, index: any) => {
                const socialLink =
                  item?.link === "GitHub"
                    ? confirmBidData && Object.keys(confirmBidData)?.length > 0
                      ? confirmBidData?.gitHub
                      : profileData?.userGithub
                    : item?.link === "LinkedIn"
                    ? confirmBidData && Object.keys(confirmBidData)?.length > 0
                      ? confirmBidData?.linkedIn
                      : profileData?.linkedIn
                    : item?.link === "Telegram"
                    ? confirmBidData && Object.keys(confirmBidData)?.length > 0
                      ? confirmBidData?.telegram
                      : profileData?.telegram
                    : "";
                return (
                  <div key={index} className="social_account">
                    <div className="social_img">
                      <img src={item?.social_img} alt="social-img" />
                    </div>
                    {socialLink ? (
                      <a
                        target="_blank"
                        href={socialLink}
                        className={item?.className}
                        rel="noreferrer"
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
      </div>
    </CommonModal>
  );
};

export default ProfileBioModal;
