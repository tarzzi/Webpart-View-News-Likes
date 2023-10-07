class RestApiService {
  private siteUrl: string;

  constructor(siteUrl: string) {
    this.siteUrl = siteUrl;
    console.log('RestApiService', this.siteUrl);
  }

  public async fetchPages(): Promise<any> {
    const apiUrl = `${this.siteUrl}/_api/web/lists/getbyTitle('Site%20Pages')/items?$select=Id,FirstPublishedDate,FileLeafRef,Title,BannerImageUrl,LikedByInformation&$orderby=FirstPublishedDate desc`;

    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json;odata=verbose',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.d.__next) {
          console.log('Next page', data.d.__next);
        }
        return data.d.results;
      })
      .catch((error) => {
        console.log('Error: ' + error);
      });
  }

  public async fetchLikes(pages: any[]): Promise<any> {
    const pagesWithLikes = pages.map(async (page: any) => {
      const likes = await this.fetchLikesForPage(page);
      return {
        ...page,
        likes,
      };
    });

    return Promise.all(pagesWithLikes);
  }
  public async fetchLikesForPage(page: any): Promise<any> {
    const apiUrl = `${page.LikedByInformation.__deferred.uri}?$expand=LikedBy`;
    if (page.ID === 3) {
      console.log('Fetching likes for page', page.Title, apiUrl);
    }
    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json;odata=verbose',
      },
    })
      .then((response) => response.json())
      .then((data) => {
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
            upn: user.email,
          };
        });

        const likeData = {
          count: d.likeCount,
          likedBy: usersLiked,
        };

        return likeData;
      })
      .catch((error) => {
        console.log('Error: ' + error);
      });
  }

  public async fetchPageQuery(q: string): Promise<any> {
    // search pages for the hub
    const apiUrl = `${this.siteUrl}/_api/search/query?querytext='${q}'&selectproperties='Title,Path,SiteName,SiteTitle,FirstPublishedDate,BannerImageUrl,LikedByInformation'&rowlimit=50`;

    return fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json;odata=verbose',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.d.__next) {
          console.log('Next page', data.d.__next);
        }
        return data.d.results;
      })
      .catch((error) => {
        console.log('Error: ' + error);
      });
  }
}

export default RestApiService;
