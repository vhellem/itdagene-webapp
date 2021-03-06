import * as React from 'react';

import styled from 'styled-components';
import Flex, { FlexItem } from 'styled-flex-component';
import { ResponsiveContent, NoBulletUl } from '../Styled';

const Container = styled('div')`
  padding: 2.5em 0em;
  border-top: 1px solid #e2e9f1;
  background-color: #f7f9fb;
`;

const RightBorderFlex = styled(FlexItem)`
  border-right: 1px solid #e2e9f1;
  margin-right: 20px;

  @media only screen and (max-width: 800px) {
    border-right: 0;
    margin-right: 10px;
  }
`;

const Footer = () => (
  <Container>
    <ResponsiveContent>
      <Flex wrap>
        <RightBorderFlex grow noShrink basis="300px">
          <NoBulletUl>
            <li>
              <img
                style={{ width: 150 }}
                src="/static/itdagene-gray.png"
                alt="itDAGENE logo"
              />
            </li>
            <li>Sem Sælands vei 7-9</li>
            <li>7491 Trondheim</li>
            <li>Orgnr. 912 601 625 </li>
          </NoBulletUl>
        </RightBorderFlex>
        <RightBorderFlex grow noShrink basis="300px">
          <NoBulletUl>
            <li>
              <strong>Kontakt</strong>
            </li>
            <li>
              Styret •{' '}
              <a href="mailto:styret@itdagene.no">styret@itdagene.no </a>
            </li>
            <li>
              Webansvarlig •{' '}
              <a href="mailto:web@itdagene.no">web@itdagene.no </a>
            </li>
          </NoBulletUl>
          <NoBulletUl>
            <li>
              <strong>Teknologi</strong>
            </li>
            <li>
              Github •{' '}
              <a href="https://github.com/itdagene-ntnu">itdagene-ntnu</a>
            </li>
            <li>
              Docs • <a href="https://docs.itdagene.no">docs.itdagene.no</a>
            </li>
          </NoBulletUl>
        </RightBorderFlex>
        <FlexItem grow={1} basis="350px">
          <NoBulletUl>
            <li>
              <strong>Om</strong>
            </li>
            <li>
              itDAGENE er en arbeidslivsmesse hvor studenter blir kjent med
              fremtidige arbeidsgivere. Messen arrangeres av studenter for
              studenter, overskuddet går til studentenes ekskursjon i
              tredjeklasse. itDAGENE arrangeres en gang i året av data- og
              kommunikasjonsteknologi ved NTNU i Trondheim.
            </li>
          </NoBulletUl>
        </FlexItem>
      </Flex>
    </ResponsiveContent>
  </Container>
);

export default styled(Footer)`
  padding: 5em 0em;
  border-top: 1px solid #e2e9f1;
  background-color: #f7f9fb;
`;
