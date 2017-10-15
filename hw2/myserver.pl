#!/usr/bin/env perl
use strict;
use warnings;
use Mojolicious::Lite;

# Documentation browser under "/perldoc"

get '/' => sub {
  my $c = shift;
  $c->reply->static('table.html');
};

get '/:htmlfile' => sub {
      my $c = shift;
      my $html = $c->stash('htmlfile');
      # unless ($html) {
      #   $c->reply->static("index.html");
      # }
      $c->reply->static($html . ".html");
    };

app->start;
