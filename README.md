# Bite-Sized Serverless: Anonymous User Identities with Cognito Lambda Triggers

This project contains the infrastructure definition used in the article Anonymous User Identities with Cognito Lambda Triggers on Bite-Sized Serverless: https://bitesizedserverless.com/bite/anonymous-user-identities-with-cognito-lambda-triggers/

The compiled CloudFormation files can be found in the `cdk.out` folder. The Python files for the Lambda functions are placed in `lambda/functions`.

To compile the CloudFormation templates, follow these steps:

1. First create a `virtualenv` with `python3 -m venv .venv`.
2. Then activate the `virtualenv` with `source .venv/bin/activate`.
3. Next, install the required Python packages by running `pip install -r requirements.txt`
4. Then compile CloudFormation by running `cdk synth`. The output will be stored in `cdk.out`.

To deploy the templates to your AWS account, run `cdk deploy`.

## Gatsby demo site

The folder `website/` contains a simple Gatsby project to interact with the user pools. To use the website, first follow the Gatsby [installation instructions](https://www.gatsbyjs.com/docs/tutorial/part-0/#installation-guide). Open the `index.js` file and update `default_user_pool_client` and `no_verify_user_pool_client` variables with the user pool clients deployed with CDK. Then navigate to the Gatsby directory and run `gatsby develop`.
