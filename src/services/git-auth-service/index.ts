import { errorSearchingUser, invalidGitCode } from "./erros";
import axios, { AxiosRequestConfig } from "axios";
import qs from "query-string";

export default async function GitOAuth(code: string) {

  const resolve: object[] = [];

  await axios.post(process.env.GIT_ACESS_lOGIN, makeParams(code), makeHeader())

    .then(async response => {

      const parsed = qs.parse(response.data);
      const gitAcessToken = parsed.access_token
      const user = await getUser(gitAcessToken.toString());
      resolve.push(user);

    }).catch(err => { throw invalidGitCode(err); });

  return resolve.length > 0 ? resolve[0] : null // FIXE ME !!
};

async function getUser(token: string) {

  const resolve: object[] = [];

  await axios.get(process.env.GIT_USER_API, makeHeader(token))

    .then(res => resolve.push(res.data))
    .catch(err => { throw errorSearchingUser(err) });

  return resolve.length > 0 ? resolve[0] : null; // famosa GAMBIARRA
};

function makeHeader(token: string = null): AxiosRequestConfig<any> {

  return token ?
    { headers: { Authorization: `Bearer ${token}` } } :
    { headers: { 'Content-Type': 'application/json' } }
};

function makeParams(code: string) {

  const { REDIRECT_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

  return {
    code,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET
  };
};