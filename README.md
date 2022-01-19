# Digital Identity Credential Issuer

# di-ipv-cri-address-front

Frontend for address collection Credential Issuer

This is the home for the front end user interface for a credential issuer as a part of the Identity Proofing and Verification (IPV) system within the GDS digital identity platform. Other repositories are used for core services or other credential issuers.

# Installation

Clone this repository and then run

```bash
yarn install

## Environment Variables

- 'BASE_URL': Externally accessible base url of the webserver. Used to generate the callback url as part of credential issuer oauth flows
- `PORT` - Default port to run webserver on. (Default to `5010`)

### Code Owners

This repo has a `CODEOWNERS` file in the root and is configured to require PRs to reviewed by Code Owners.
