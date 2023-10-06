import * as React from 'react';
import styles from './LikeRetriever.module.scss';
import { ILikeRetrieverProps } from './ILikeRetrieverProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PageComponent } from './PageCard/PageComponent';

// import { escape } from '@microsoft/sp-lodash-subset';

interface ILikeRetrieverState {
  pages: any[];
}

export default class LikeRetriever extends React.Component<ILikeRetrieverProps, ILikeRetrieverState> {
  private ctx: WebPartContext;

  constructor(props: ILikeRetrieverProps) {
    super(props);
    this.ctx = props.context;
    this.state = {
      pages: [],
    };
  }

  public async componentDidMount(): Promise<void> {
    console.log(this.ctx);
    // get all sites that belong to the hub that the user is currently in
    const pages = await this.fetchPages("https://tenant.sharepoint.com/sites/sitename");
    console.log("Retrieved sites", pages);

    // get likedbyinfo for each page
    const pagesWithLikes = await this.fetchLikes(pages);
    console.log("Retrieved likes", pagesWithLikes);
    this.setState({
      pages: pagesWithLikes,
    });


  }

  private fetchLikes(pages: any[]): Promise<any> {
    const pagesWithLikes = pages.map(async (page: any) => {
      const likes = await this.fetchLikesForPage(page);
      return {
        ...page,
        likes,
      };
    }
    );

    return Promise.all(pagesWithLikes);


  }

  private fetchLikesForPage(page: any): Promise<any> {

    const apiUrl = `${page.LikedByInformation.__deferred.uri}?$expand=LikedBy`;
    if (page.ID === 3) {
      console.log("Fetching likes for page", page.Title, apiUrl);
    }
    return fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json;odata=verbose",
      },
    })
      .then(response => response.json())
      .then(data => {
        const d = data.d;
        const l = d.likedBy.results;

        if (l.length === 0) {
          return {
            count: 0,
            likedBy: [],
          };
        }

        const usersLiked = l.map((user: any) => {
          return {
            name: user.name,
            upn: user.loginName,
          };
        });

        const likeData = {
          count: d.likeCount,
          likedBy: usersLiked,
        };

        return likeData;
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  }



  private fetchPages(siteUrl: any): Promise<any> {
    const apiUrl = `${siteUrl}/_api/web/lists/getbyTitle('Site%20Pages')/items?$select=Id,FirstPublishedDate,FileLeafRef,Title,BannerImageUrl,LikedByInformation&$orderby=FirstPublishedDate desc`;

    return fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json;odata=verbose",
      },
    })
      .then(response => response.json())
      .then(data => {
        return data.d.results;
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  }



  public render(): React.ReactElement<ILikeRetrieverProps> {
    const {
      description,
      hasTeamsContext,
    } = this.props;

    const { pages } = this.state;


    return (
      <section className={`${styles.likeRetriever} ${hasTeamsContext ? styles.teams : ''}`}>
        {description}
        <div id='container' style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px"
        }} >
          {pages && pages.length > 0 && pages.map((page: any) => {
            return (
              PageComponent(page)
            );
          })}
        </div>
      </section >
    );
  }
}