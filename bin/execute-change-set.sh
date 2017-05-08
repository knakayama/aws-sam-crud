#!/usr/bin/env bash

stack_name="$1"
stage="$2"

aws cloudformation execute-change-set \
 --change-set-name "$(aws cloudformation list-change-sets \
   --stack-name "$stack_name-$stage" \
   --query 'reverse(sort_by(Summaries,&CreationTime))[0].ChangeSetId' \
   --output text)"
