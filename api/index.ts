import polka from 'polka';
import { City, State, Country } from 'country-state-city';

const checkToken = (req, res) => {
  if (req.headers.authorization !== process.env.TOKEN) {
    res.statusCode = 401;
    res.end('Unauthorized');
    return;
  }
};

polka()
  .use(checkToken)
  .get('/countries', (req, res) => {
    res.json(Country.getAllCountries());
  })
  .get('/country', (req, res) => {
    res.json(Country.getCountryByCode(req.query.country));
  })
  .get('/states', (req, res) => {
    res.json(State.getStatesOfCountry(req.query.country));
  })
  .get('/cities', (req, res) => {
    res.json(City.getCitiesOfState(req.query.country, req.query.state));
  })
  .listen(3000, () => {
    console.log(`Started`);
  });
