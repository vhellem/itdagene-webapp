import { createPaginationContainer, graphql } from 'react-relay';
import { Image } from '../Styled';
import Link from 'next/link';
import Router from 'next/router';
import * as React from 'react';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import Flex, { FlexItem } from 'styled-flex-component';
import { withRouter } from 'next/router';
import styled from 'styled-components';
import type { JoblistingsContainer_root } from './__generated__/JoblistingsContainer_root.graphql';
import Select from 'react-select';
import AsyncSelect from 'react-select/lib/Async';
import { fetchQuery } from 'relay-runtime';

const searchQuery = graphql`
  query JoblistingsContainer_company_search_Query($query: String) {
    search(query: $query, types: [COMPANY_WITH_JOBLISTING]) {
      ... on Company {
        name
        id
      }
      __typename
    }
  }
`;

const CompanyImage = styled(Image)`
  width: 220px;
  object-fit: contain;
  height: 180px;
  margin-left: auto;
  margin-right: auto;
  padding: 14px;
  @media only screen and (max-width: 767px) {
    width: 120px;
    height: 100px;
    padding: 7px;
  }
`;

export const query = graphql`
  query JoblistingsContainer_Query(
    $count: Int
    $cursor: String
    $type: String
    $fromYear: Float
    $toYear: Float
    $company: ID
  ) {
    ...JoblistingsContainer_root
      @arguments(
        count: $count
        cursor: $cursor
        type: $type
        company: $company
        fromYear: $fromYear
        toYear: $toYear
      )
  }
`;
const Sidebar = styled('div')`
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  #border-left: 1px solid #e2e9f1;
  margin: 20px 20px 20px 20px;
  padding: 0 20px;
`;

const options = [
  { value: '', label: 'Alle' },
  { value: 'pp', label: 'Fastjobb' },
  { value: 'si', label: 'Sommerjobb' }
];

const TypeSelector = withRouter(({ router }) => (
  <div style={{ width: '100%' }}>
    <Select
      isClearable
      placeholder="Ikke valgt"
      defaultValue={options.find(el => el.value === router.query.type)}
      onChange={ee => {
        Router.push({
          pathname: '/jobbannonser',
          query: { ...Router.query, type: ee && ee.value }
        });
      }}
      options={options}
    />
  </div>
));
const loadOptions = async (inputValue, environment) => {
  const data = await fetchQuery(environment, searchQuery, {
    query: inputValue
  });
  const options = data.search.map(result => ({
    value: result.id,
    label: result.name
  }));
  return options;
};
function debounce(inner, ms = 0) {
  let timer = null;
  let resolves = [];

  return function(...args) {
    // Run the function after a certain amount of time
    clearTimeout(timer);
    timer = setTimeout(() => {
      // Get the result of the inner function, then apply it to the resolve function of
      // each promise that has been created since the last time the inner function was run
      let result = inner(...args);
      resolves.forEach(r => r(result));
      resolves = [];
    }, ms);

    return new Promise(r => resolves.push(r));
  };
}

const CompanySelector = ({ router, environment }) => (
  <div style={{ width: '100%' }}>
    <AsyncSelect
      isClearable
      loadOptions={debounce(input => loadOptions(input, environment), 150)}
      defaultValue={{ label: router.query.companyName }}
      placeholder="Ikke valgt"
      noOptionsMessage={input =>
        input.inputValue ? 'Fant ingen på bedrifter... :(' : 'Søk her!'
      }
      filterOptions={(options, filter, currentValues) => {
        // Do no filtering, just return all options
        // https://github.com/JedWatson/react-select#note-about-filtering-async-options
        return options;
      }}
      onChange={ee => {
        const href = {
          pathname: '/jobbannonser',
          query: {
            ...Router.query,
            company: ee && ee.value,
            companyName: ee && ee.label
          }
        };
        Router.push(href, href, { shallow: true });
      }}
      onInputChange={this.handleInputChange}
    />
  </div>
);

const JoblistigsContainer = withRouter(
  (props: { root: JoblistingsContainer_root }) => (
    <div>
      <Flex wrapReverse>
        <FlexItem center basis="700px" grow={26}>
          <Flex wrap style={{ width: '100%' }}>
            {props.root &&
              props.root.joblistings.edges.map(({ node }) => (
                <Link
                  key={node.id}
                  href={{
                    pathname: '/jobbannonse',
                    query: { id: node.id }
                  }}
                >
                  <div
                    style={{ cursor: 'pointer', maxWidth: 239, padding: 15 }}
                  >
                    <CompanyImage
                      src={node.company.logo || '/static/itdagene-svart.png'}
                    />
                    <a>
                      {node.title} - {node.company.name}
                    </a>
                  </div>
                </Link>
              ))}

            {props.root &&
              props.root.joblistings.edges.length === 0 && (
                <h2> Fant ingen annonser med søket ditt :( </h2>
              )}
          </Flex>

          {props.relay.hasMore() && (
            <h3 style={{ textAlign: 'center' }}>
              <a
                href="/#"
                onClick={e => {
                  if (!props.relay.hasMore() || props.relay.isLoading()) {
                    return;
                  }

                  props.relay.loadMore(
                    9, // Fetch the next 9 feed items
                    error => {}
                  );
                  e.preventDefault();
                }}
              >
                Hent flere
              </a>
            </h3>
          )}
        </FlexItem>
        <FlexItem basis="315px" grow={1}>
          <Sidebar>
            <h4> Type </h4>
            <TypeSelector />
            <h4> Årstrinn </h4>
            <Range
              onAfterChange={ee => {
                Router.push({
                  pathname: '/jobbannonser',
                  query: { ...Router.query, fromYear: ee[0], toYear: ee[1] }
                });
              }}
              marks={{
                1: '1.klasse',
                2: '2.klasse',
                3: '3.klasse',
                4: '4.klasse',
                5: '5.klasse'
              }}
              dots
              min={1}
              max={5}
              defaultValue={[
                parseInt(props.router.query.fromYear, 10) || 1,
                parseInt(props.router.query.toYear, 10) || 5
              ]}
            />
            <h4> Bedrift</h4>
            <CompanySelector
              router={props.router}
              environment={props.relay.environment}
            />
          </Sidebar>
        </FlexItem>
      </Flex>
    </div>
  )
);

export default createPaginationContainer(
  JoblistigsContainer,
  {
    root: graphql`
      fragment JoblistingsContainer_root on Query
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 9 }
          cursor: { type: "String" }
          type: { type: "String" }
          fromYear: { type: "Float" }
          toYear: { type: "Float" }
          company: { type: "ID" }
        ) {
        joblistings(
          first: $count
          after: $cursor
          type: $type
          company: $company
          fromYear: $fromYear
          toYear: $toYear
        )
          @connection(
            key: "Joblistings_joblistings"
            filters: ["toYear", "fromYear", "company", "type"]
          ) {
          edges {
            node {
              id
              __typename
              type
              title
              url
              company {
                name
                logo(width: 220, height: 180)
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.root && props.root.joblistings;
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      };
    },
    getVariables(props, { cursor, count }, fragmentVariables) {
      const { type, company, fromYear, toYear } = fragmentVariables;
      return {
        count,
        fromYear,
        toYear,
        cursor,
        type,
        company
      };
    },
    query
  }
);
