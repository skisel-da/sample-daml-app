// Copyright (c) 2021 Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import {Container, Grid, Header} from 'semantic-ui-react';
import { Portfolio } from '@daml.js/create-daml-app';
import {useParty, useStreamFetchByKeys, useStreamQueries} from '@daml/react';
import IdentityCheckView from './IdentityCheckView';
import Ledger from "@daml/ledger";

type Props = {
  ledger: Ledger;
}

// USERS_BEGIN
const KYCView: React.FC<Props> = (props) => {
  const username = useParty();
  const myUserResult = useStreamFetchByKeys(Portfolio.KYCProvider, () => [username], [username]);
  const myUser = myUserResult.contracts[0]?.payload;
  const kycCheckContracts = useStreamQueries(Portfolio.KycCheck).contracts;
  const ledger = props.ledger;

  // Sorted list of users that are following the current user
  const kycChecks = useMemo(
      () => kycCheckContracts
          .map(contract => contract.payload)
          .filter(check => check.check.provider === username)
          .map(check => check.check)
      ,
      [kycCheckContracts, username]
  );

  const onApproveIdentity = async (iky: Portfolio.IKnowYou): Promise<boolean> => {
    try {
      await ledger.exerciseByKey(Portfolio.KycCheck.IdentityChecked, iky.owner, {});
      return true;
    } catch (error) {
      alert(`Unknown error:\n${JSON.stringify(error)}`);
      return false;
    }
  }

  return (
    <Container>
      <Grid centered columns={1}>
        <Grid.Row stretched>
          <Grid.Column>
            <Header as='h1' size='huge' color='blue' textAlign='center' style={{padding: '1ex 0em 0ex 0em'}}>
                {myUser ? `Approve Identities` : 'Loading...'}
            </Header>
            <IdentityCheckView ikys={kycChecks} onApproveIdentity={onApproveIdentity}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
}

export default KYCView;
