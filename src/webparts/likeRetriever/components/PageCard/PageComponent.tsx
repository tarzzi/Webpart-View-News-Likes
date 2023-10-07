import * as React from 'react';
import { LivePersona } from "@pnp/spfx-controls-react/lib/LivePersona";
import styles from './PageComponent.module.scss';

interface PageComponentProps {
  page: any;
  serviceScope: any;
}

interface PageComponentState {
  listID: string;
}

export class PageComponent extends React.Component<PageComponentProps, PageComponentState> {

  constructor(props: PageComponentProps) {
    super(props);

    this.state = {
      listID: this.generateLikeListId()
    };
  }

  private generateLikeListId = (): string => {
    return `likesList-${this.props.page.ID}`;
  }

  private showLikesList = (): void => {
    const likesList = document.getElementById(this.state.listID);
    likesList.style.display = likesList.style.display === 'none' ? 'grid' : 'none';
  }

  public render(): JSX.Element {
    const { page, serviceScope } = this.props;
    const { listID } = this.state;

    const bannerUrl = page.BannerImageUrl ? page.BannerImageUrl.Url : '';

    return (
      <div className={styles.pageContainer}>
        <div className={styles.pageBannerContainer}>
          <img src={bannerUrl} alt="Page Banner" className={styles.pageBannerImage} />
          <div className={styles.pageContentContainer}>
            <h3 className={styles.pageTitle}>
              {page.Title ? page.Title : ''}
            </h3>
            {page.FirstPublishedDate && <p className={styles.pagePublishedDate}>
              Published: {page.FirstPublishedDate}
            </p>
            }
            <button onClick={this.showLikesList} className={styles.pageLikesButton}>
              Likes: {page.likes ? page.likes.count : 0}
            </button>
          </div>
        </div>
        <div id={listID} className={styles.likesListContainer}>
          {page.likes && page.likes.likedBy && page.likes.likedBy.length > 0 && page.likes.likedBy.map((user: any) => {
            return (
              <LivePersona upn={user.upn} key={user.upn}
                template={
                  <>
                    <span className={styles.userNameSpan}>{user.name}</span>
                  </>
                }
                serviceScope={serviceScope}
              />
            );
          }
          )}
        </div>
      </div>
    );
  }
}
