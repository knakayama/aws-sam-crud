#!/usr/bin/env bash

s3_bucket="$1"
environment="$2"
template="sam.yml"
template_out=".sam/packaged-$environment.yml"
s3_prefix="$environment/$(TZ=Asia/Tokyo date '+%Y%m%d-%H:%M:%S')"

aws s3 cp "src/api/swagger.yml" "s3://$s3_bucket/$s3_prefix/swagger.yml" \
  && aws cloudformation package \
    --template-file "$template" \
    --s3-bucket "$s3_bucket" \
    --s3-prefix "$s3_prefix" \
    --output-template-file "$template_out"
