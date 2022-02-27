import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useEffect, useState } from "react";
import { DropdownButton, Dropdown, Form, Button } from "react-bootstrap";
import { Frequency } from "./constants";

const USER_QUERY = gql`
  query SettingsUserQuery($email: String!) {
    user(email: $email) {
      id
      nudgeFrequency
      outreachFrequency
    }
  }
`;

const SET_SETTINGS_MUTATION = gql`
  mutation SetFrequencyMutation(
    $email: String!
    $nudgeFrequency: String!
    $outreachFrequency: String!
  ) {
    setUserSettings(
      email: $email
      nudgeFrequency: $nudgeFrequency
      outreachFrequency: $outreachFrequency
    ) {
      user {
        id
        nudgeFrequency
        outreachFrequency
      }
    }
  }
`;

type Settings = {
  nudgeFrequency: Frequency;
  outreachFrequency: Frequency;
};

const DEFAULT_SETTINGS = {
  nudgeFrequency: Frequency.Weekly,
  outreachFrequency: Frequency.EveryOtherMonth,
};

const UserSettings = ({ email }: { email: string }) => {
  const { data } = useQuery(USER_QUERY, {
    variables: {
      email,
    },
  });
  const [setSettingsMutation] = useMutation(SET_SETTINGS_MUTATION);

  if (!data) {
    return null;
  }

  const settings: Settings = data.user;

  return (
    <div>
      <h4>Settings ({email})</h4>
      <Form.Label>Nudge Frequency</Form.Label>
      <DropdownButton title={settings.nudgeFrequency}>
        {Object.values(Frequency).map((f) => (
          <Dropdown.Item
            onClick={() =>
              setSettingsMutation({
                variables: {
                  ...settings,
                  email,
                  nudgeFrequency: f,
                },
              })
            }
          >
            {f}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <Form.Label>Outreach Frequency</Form.Label>
      <DropdownButton title={settings.outreachFrequency}>
        {Object.values(Frequency).map((f) => (
          <Dropdown.Item
            onClick={() =>
              setSettingsMutation({
                variables: {
                  ...settings,
                  email,
                  outreachFrequency: f,
                },
              })
            }
          >
            {f}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
};

export default UserSettings;
