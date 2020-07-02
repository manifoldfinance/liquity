import { Theme } from "theme-ui";

const baseColors = {
  blue: "#1542cd",
  purple: "#745ddf",
  cyan: "#2eb6ea",
  green: "#28c081",
  yellow: "#fd9d28",
  red: "#dc2c10",
  lightRed: "#ff755f"
};

const colors = {
  primary: baseColors.blue,
  secondary: baseColors.purple,
  accent: baseColors.cyan,

  success: baseColors.green,
  warning: baseColors.yellow,
  danger: baseColors.red,
  dangerHover: baseColors.lightRed,
  info: baseColors.blue,
  invalid: "pink",

  text: "#293147",
  background: "white",
  border: "#c8cbd0",
  muted: "#eaebed"
};

const theme: Theme = {
  breakpoints: ["40em", "52em", "64em"],

  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],

  radii: [0, 8, 16],

  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Karbon, sans-serif",
    monospace: "Menlo, monospace"
  },

  fontSizes: [13, 14, 16, 20, 24, 32, 48, 64, 96],

  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 600,

    body: 400,
    heading: 600
  },

  lineHeights: {
    body: 1.5,
    heading: 1.25
  },

  colors,

  borders: [0, "1px solid"],

  shadows: ["0", "0px 4px 8px rgba(0, 0, 0, 0.1)", "0px 8px 16px rgba(0, 0, 0, 0.1)"],

  text: {
    heading: {
      fontSize: 4
    }
  },

  sizes: {
    container: "500px"
  },

  layout: {
    container: {
      p: 3,
      minHeight: "440px"
    }
  },

  cards: {
    primary: {
      mx: 4,
      mt: "10px",
      mb: "42px",
      p: 3,

      bg: "rgba(255, 255, 255, 0.75)",
      borderRadius: 2,
      boxShadow: 2,

      h2: {
        fontSize: 3,
        mb: 2
      },

      table: {
        fontSize: 1,
        letterSpacing: "-0.02em",
        borderCollapse: "collapse",

        td: {
          p: 0
        }
      }
    }
  },

  buttons: {
    primary: {
      px: 4,
      py: 3,

      cursor: "pointer",
      fontFamily: "body",
      fontWeight: "bold",
      borderRadius: 1,

      ":hover": {
        bg: "secondary"
      },

      ":focus": {
        bg: "secondary"
      },

      svg: {
        mr: 2
      }
    },

    icon: {
      color: "primary",
      cursor: "pointer",

      ":hover": {
        color: "accent"
      },

      ":focus": {
        color: "accent"
      }
    },

    dropdown: {
      px: 3,
      py: 0,

      cursor: "pointer",
      fontSize: 3,
      fontFamily: "heading",
      fontWeight: "heading",
      color: "text",

      bg: "rgba(255, 255, 255, 0.75)",
      borderRadius: 2,
      boxShadow: 2,

      ":hover": {
        bg: "secondary",
        color: "white"
      },

      ":focus": {
        bg: "secondary",
        color: "white"
      }
    }
  },

  forms: {
    input: {
      p: 3,

      fontFamily: "heading",
      fontWeight: "medium",
      fontSize: 5,
      lineHeight: 1,

      border: 1,
      borderColor: "border",
      borderRadius: 1,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderRight: "none",

      ":disabled": {
        opacity: 1,
        WebkitTextFillColor: "text"
      }
    },

    unit: {
      p: 3,
      minWidth: "3.5em",
      //bg: "muted",
      bg: "rgba(45, 55, 75, 0.1)",

      fontFamily: "heading",
      fontWeight: "medium",
      fontSize: 5,
      lineHeight: 1,

      textAlign: "center",
      justifyContent: "space-around",

      border: 1,
      borderColor: "border",
      borderRadius: 1,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      borderLeft: "none",

      button: {
        p: 0,
        width: "unset",
        height: "unset"
      }
    }
  },

  styles: {
    root: {
      fontSize: 2,
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body"
    },

    a: {
      color: "primary",
      ":hover": { color: "accent" }
    },

    backgroundGradient: {
      background: [
        "none",
        "linear-gradient(90deg, rgba(255, 255, 255, 1) 60%, rgba(255, 255, 255, 0) 90%)"
      ]
    }
  }
};

export default theme;
