#!/bin/bash
set -e
export AWS_DEFAULT_REGION=us-east-1

sudo mkdir -p /var/app/current/media
sudo chown -R ec2-user:ec2-user /var/app/current/media

aws s3 sync s3://designer-portfolio-frontend/media/ /var/app/current/media/ --delete

sudo nginx -s reload || true