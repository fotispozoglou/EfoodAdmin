const pathToRegex = path => new RegExp(`^${ path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") }$`);

export default class Router {
  _routes;
  _initalQueue = [  ];
  _goingBack = false;

  constructor(  ) {

    this._routes = [];

  }

  route( ...routes ) {

    this._routes = [ ...routes ];

  }

  getParams( match ) {

    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(
      
      keys.map((key, i) => {
    
        return [key, values[i]];
    
      }
    
    ));

  }

  async handleRoute( firstRoute = false ) {

    const potentialMatches = this._routes.map(route => {
      return {
        route: route,
        result: location.pathname.match(pathToRegex(route.path))
      };
    });

    const match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    await match.route.render( this.getParams( match ) );

  }

  addLinkClick( ...elements ) {

    for ( const element of elements ) {

      element.addEventListener('click', event => {

        event.preventDefault();
  
        window.history.pushState("", "", `${ element.href }`);
  
        this.handleRoute(  ); 
  
      });

    }

  }

  init( ) {

    this.handleRoute( true );

    const links = document.querySelectorAll('[role="link"]');
    
    links.forEach( link => {

      link.addEventListener('click', event => {

        event.preventDefault();

        window.history.pushState("", "", `${ link.href }`);

        this.handleRoute(  );

      });

    });

    window.addEventListener('popstate', () => { this.handleRoute(  ) });

  }

  go( path ) {

    window.history.pushState("", "", path);

    this.handleRoute();

  }

  back() {

    window.history.go( -1 );

    this._goingBack = true;

  }

}