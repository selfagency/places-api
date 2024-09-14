import polka from 'polka';
import { City, State, Country } from 'country-state-city';
import helmet from 'helmet';
import bearerToken from 'polka-bearer-token';

const app = polka();
const port = process.env.PORT || 3000;

app
  .use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', 'https://opencommunities.info, http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  })
  .use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  )
  .use(bearerToken())
  .use((req: any, res: any, next: any) => {
    if (req.token !== process.env.TOKEN) {
      res.statusCode = 401;
      res.end('Unauthorized');
    }
    next();
  })
  .get('/countries', (req, res) => {
    res.end(JSON.stringify(Country.getAllCountries()));
  })
  .get('/countries/:id', (req, res) => {
    res.end(JSON.stringify(Country.getCountryByCode(req.params.id)));
  })
  .get('/states', (req, res) => {
    res.end(JSON.stringify(State.getStatesOfCountry(req.query.country as string)));
  })
  .get('/states/:id', (req, res) => {
    res.end(JSON.stringify(State.getStateByCode(req.params.id)));
  })
  .get('/cities', (req, res) => {
    res.end(JSON.stringify(City.getCitiesOfState(req.query.country as string, req.query.state as string)));
  })
  .get('/', (req, res) => {
    res.statusCode = 401;
    res.end('Unauthorized');
  });

app.listen(port, () => {
  console.log(`Started on ${port}`);
});
