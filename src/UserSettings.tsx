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
      friendsPerOutreach
    }
  }
`;

const SET_SETTINGS_MUTATION = gql`
  mutation SetFrequencyMutation(
    $email: String!
    $nudgeFrequency: String!
    $outreachFrequency: String!
    $friendsPerOutreach: Int!
  ) {
    setUserSettings(
      email: $email
      nudgeFrequency: $nudgeFrequency
      outreachFrequency: $outreachFrequency
      friendsPerOutreach: $friendsPerOutreach
    ) {
      user {
        id
        nudgeFrequency
        outreachFrequency
        friendsPerOutreach
      }
    }
  }
`;

type Settings = {
  nudgeFrequency: Frequency;
  outreachFrequency: Frequency;
  friendsPerOutreach: number;
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
      <Form.Group>
        <Form.Label>Nudges</Form.Label>
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
        <Form.Text className="text-muted">
          How often you'd like to get an email
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Ketchup Frequency</Form.Label>
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
        <Form.Text className="text-muted">
          Minimum cool down between consecutive ketchups with a friend
        </Form.Text>
      </Form.Group>
      <Form.Group>
        <Form.Label>Batch Size</Form.Label>
        <Form.Control
          placeholder={String(settings.friendsPerOutreach)}
          onChange={(e) => {
            setSettingsMutation({
              variables: {
                ...settings,
                email,
                friendsPerOutreach: Number(e.target.value),
              },
            });
          }}
        />
        <Form.Text className="text-muted">
          # of suggested ketchups per email
        </Form.Text>
      </Form.Group>
    </div>
  );
};

export default UserSettings;
