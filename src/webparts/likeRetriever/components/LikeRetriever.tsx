import * as React from 'react';
import styles from './LikeRetriever.module.scss';
import { ILikeRetrieverProps } from './ILikeRetrieverProps';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PageComponent } from './PageCard/PageComponent';
import RestApiService from '../services/RestApiService';
//import FilterFields from './FilterFields/FilterFields';
// import { escape } from '@microsoft/sp-lodash-subset';

interface ILikeRetrieverState {
  sites: any[];
  siteUrl: string;
  allPages: any[];
  pages: any[];
  filteredPages: any[];
  useFilter: boolean;
  loading: boolean;
  queryType: string;
  queryText: string;
  __next: string;
}


export default class LikeRetriever extends React.Component<ILikeRetrieverProps, ILikeRetrieverState> {
  private ctx: WebPartContext;
  private restApiService: RestApiService;

  constructor(props: ILikeRetrieverProps) {
    super(props);
    this.ctx = props.context;
    this.state = {
      loading: false,
      queryType: 'all',
      useFilter: false,
      queryText: '',
      sites: this.props.sites,
      siteUrl: '',
      allPages: [],
      pages: [],
      filteredPages: [],
      __next: ''
    };


    const defaultSite = this.props.sites[0];
    this.restApiService = new RestApiService(defaultSite.url);

  }


  public async componentDidMount(): Promise<void> {
    console.log(this.props.sites)
    console.log(this.ctx);

    const pages = await this.restApiService.fetchPages();
    console.log("Retrieved sites", pages);

    if (this.state.queryType === 'all') {
      const pagesWithLikes = await this.restApiService.fetchLikes(pages);
      console.log("Retrieved likes", pagesWithLikes);
      this.setPages(pagesWithLikes);
      this.setState({
        pages: pagesWithLikes,
      });
    }

    if (this.state.queryType === 'search') {
      const pagesWithLikes = await this.restApiService.fetchPageQuery("q");
      console.log("Retrieved likes", pagesWithLikes);
      this.setState({
        pages: pagesWithLikes,
      });
    }
  }

  public async componentDidUpdate(prevProps: ILikeRetrieverProps, prevState: ILikeRetrieverState): Promise<void> {
    if (this.state.queryType !== prevState.queryType) {
      const pages = await this.restApiService.fetchPages();
      console.log("Retrieved sites", pages);

      if (this.state.queryType === 'all') {
        const pagesWithLikes = await this.restApiService.fetchLikes(pages);
        console.log("Retrieved likes", pagesWithLikes);
        this.setState({
          pages: pagesWithLikes,
        });
      }

      if (this.state.queryType === 'search') {
        const pagesWithLikes = await this.restApiService.fetchPageQuery(this.state.queryText);
        console.log("Retrieved likes", pagesWithLikes);
        this.setState({
          pages: pagesWithLikes,
        });
      }
    }
    if( this.state.queryText !== prevState.queryText){
      console.log("queryText changed", this.state.queryText)
      if(this.state.queryText === ""){
        const pages = await this.restApiService.fetchPages();
        console.log("Retrieved sites", pages);
        this.setState({
          pages: pages,
          useFilter: false
        });
        return;
      }

      const q = this.state.queryText;
      const pages = this.state.pages;
      console.log("pages", pages)
      const filteredPages = pages.filter((page) => {
        return page.FileLeafRef.toLowerCase().includes(q.toLowerCase()) || page.Title.toLowerCase().includes(q.toLowerCase());
      });
      this.setState({
        filteredPages: filteredPages,
        useFilter: true
      });
    }
  }

  private setPages = (pages: any[]): void => {
    
    this.setState({
      allPages: pages,
    });
  }

/*   private setQueryType = (event: any): void => {
    this.setState({
      queryType: event.target.value,
    });
  } */

  private setSite = (event: any): void => {
    this.restApiService = new RestApiService(event.target.value);
    //refetch pages
    this.restApiService.fetchPages().then((pages) => {
      this.setState({
        pages: pages,
      });
    }
    ).catch((error) => {
      console.log(error);
    });
  }



  public render(): React.ReactElement<ILikeRetrieverProps> {
    const {
      hasTeamsContext,
    } = this.props;

    const handleQueryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
      this.setState({ queryType: event.target.value });
    }

    const handleQueryTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      this.setState({ queryText: event.target.value });
    }

    const { sites, pages, queryType, useFilter,filteredPages } = this.state;
    
    const serviceScope = this.props.context.serviceScope;

    return (
      <section  style={{display:"grid", gridAutoColumns:"auto", gap:"20px"}} className={`${styles.likeRetriever} ${hasTeamsContext ? styles.teams : ''}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap:"15px" }}>
            <select name="queryType" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }} value={queryType} onChange={handleQueryTypeChange}>
              <option value="all">Latest</option>
              <option value="search">Search</option>
            </select>
            <select  id="site" name="site" onChange={this.setSite} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
              {sites.map((site) => (
                <option key={site.id} value={site.url}>
                  {site.title}
                </option>
              ))}
            </select>
            <input type="text" placeholder="Enter search query" style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '5px'  }} onChange={handleQueryTextChange} />
          </div>
        </div>
        <div id='container' className={styles.container} >
          {pages && !useFilter && pages.length > 0 && pages.map((page: any) => {
            return (
              <PageComponent key={page.Title} page={page} serviceScope={serviceScope} />
            );
          })}
          {pages && useFilter && filteredPages.length > 0 && filteredPages.map((page: any) => {
            return (
              <PageComponent key={page.Title} page={page} serviceScope={serviceScope} />
            );
          })}
        </div>
      </section >
    );
  }
}