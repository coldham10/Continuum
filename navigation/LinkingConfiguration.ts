import * as Linking from "expo-linking";

export default {
  prefixes: ["/"],
  config: {
    screens: {
      Root: {
        screens: {
          Positive: {
            screens: {
              PositiveScreen: "one",
            },
          },
          Negative: {
            screens: {
              NegativeScreen: "two",
            },
          },
          Overview: {
            screens: {
              OverviewScreen: "three",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
