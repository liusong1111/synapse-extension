import * as React from "react";

interface AppProps {
  title: string
}

interface AppState {}

export default class extends React.Component<AppProps, AppState> {
  constructor(props: AppProps, state: AppState) {
    super(props, state);
  }

  render() {
    return (
      <h3>
        {this.props.title}
      </h3>
    )
  }
}