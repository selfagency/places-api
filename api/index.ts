import { City, Country, State } from 'country-state-city';
import helmet from 'helmet';
import polka from 'polka';
import bearerToken from 'polka-bearer-token';

const app = polka();
const port = process.env.PORT || 3000;

app
  .use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
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
  .use((req, res, next) => {
    const token = (req as typeof req & { token: string }).token.replace('Bearer ', '');
    // console.log(token);
    if (token !== process.env.TOKEN) {
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
