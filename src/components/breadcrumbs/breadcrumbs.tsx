import { Link } from 'react-router-dom';
import styles from './breadcrumbs.module.scss';
import { AppRoute, PageNames, PropertyTypeEnum, TYPE_DISPLAY_NAMES } from '../../const';

type BreadcrumbsProps = {
    activeType: PropertyTypeEnum;
};

function Breadcrumbs({ activeType }: BreadcrumbsProps) {
    const breadcrumbs = [
        { name: PageNames.Home.name, path: AppRoute.Home, key: PageNames.Home.key },
        { name: TYPE_DISPLAY_NAMES[activeType], path: AppRoute.Home, key: 'active-property' },
    ].filter(Boolean);
    
     return (
         <nav className={styles.breadcrumbs}>
             <div>
                 <ul className={styles.breadcrumbsList}>
                     {breadcrumbs.map((breadcrumb) => (
                            <li className={styles.breadcrumbsItem} key={breadcrumb.key}>
                                 {breadcrumb ? (
                                     <Link
                                         className={styles.breadcrumbsLink}
                                         to={breadcrumb.path}
                                     >
                                        {breadcrumb.name}
                                     </Link>
                                ) : null}
                            </li>
                     ))
                     }
                 </ul>
             </div>
          <Link to='/'> </Link>
        </nav>
      );
}

export default Breadcrumbs;