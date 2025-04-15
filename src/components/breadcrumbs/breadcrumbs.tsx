import { Link } from 'react-router-dom';
import styles from './breadcrumbs.module.scss';
import { AppRoute, PageNames } from '../../const';

const breadcrumbs = [
    { name: PageNames.Home.name, path: AppRoute.Home, key: PageNames.Home.key },
    { name: 'asdd', path: AppRoute.Home, key: 'asd' },
  ].filter(Boolean);

function Breadcrumbs() {
     return (
         <nav className={styles.breadcrumbs}>
             <div>
                 <ul className={styles.breadcrumbsList}>
                     {breadcrumbs.map((breadcrumb) => {
                         if (!breadcrumb) {
                             return null;
                         };
                         return (
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
                         )
                     })
                     }
                 </ul>
             </div>
          <Link to='/'> </Link>
        </nav>
      );
}

export default Breadcrumbs;