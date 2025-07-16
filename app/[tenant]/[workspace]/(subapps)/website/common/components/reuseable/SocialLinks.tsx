import {FC} from 'react';

// ========================================================
type SocialLinksProps = {
  className?: string;
  links: {id: string; icon: string; url: string}[];
};
// ========================================================

const SocialLinks: FC<SocialLinksProps> = ({
  className = 'nav social social-white mt-4',
  links,
}) => {
  return (
    <nav className={className}>
      {links.map(({id, icon, url}) => (
        <a href={url} key={id} target="_blank" rel="noreferrer">
          <i className={icon} />
        </a>
      ))}
    </nav>
  );
};

export default SocialLinks;
