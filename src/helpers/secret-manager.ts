import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function accessSecret(name, version = 'latest') {
  try {
    // if (!process.env.GCP_PROJECT_ID) {
    //   throw 'Please set the GCP_PROJECT_ID env var.';
    // }
    const fullName =
      `projects/soy-serenity-368016/secrets/` + `${name}/versions/${version}`;

    const [response] = await client.accessSecretVersion({ name: fullName });
    const payload = response.payload.data.toString();
    return payload;
  } catch (ex) {
    console.log(ex.toString());
  }
}
