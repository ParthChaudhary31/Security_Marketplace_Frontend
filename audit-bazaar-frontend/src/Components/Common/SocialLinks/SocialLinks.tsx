import {
  DiscordIcon,
  FacebookIcon,
  TelegramIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "../../../Assets/Images/Icons/SvgIcons";
import "./SocialLinks.scss";

const socials = [
  {
    icon: <TwitterIcon />,
    href: "https://twitter.com/intent/tweet?url=",
  },
  {
    icon: <FacebookIcon />,
    href: "https://www.facebook.com/sharer.php?u=",
  },
  {
    icon: <TelegramIcon />,
    href: "https://telegram.me/share/url?url=",
  },
  {
    icon: <YoutubeIcon />,
    href: "https://www.youtube.com/",
  },
  {
    icon: <TiktokIcon />,
    href: "#",
  },
  {
    icon: <DiscordIcon />,
    href: "https://discord.com/",
  },
];

const SocialLinks = () => {
  return (
    <ul className="social-links">
      {socials.map(
        (item: any, key: any) =>
          item.href && (
            <li key={key}>
              <a
                href={item.href}
                rel="noreferrer"
                target="popup"
                onClick={() =>
                  window.open(
                    window.location.origin,
                    "popup",
                    "width=600,height=600,scrollbars=no,resizable=no"
                  )
                }
              >
                {item.icon}
              </a>
            </li>
          )
      )}
    </ul>
  );
};

export default SocialLinks;
