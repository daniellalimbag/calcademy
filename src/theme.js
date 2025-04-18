import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#E8F8EE',
      100: '#B7E7C8',
      200: '#86D6A2',
      300: '#5AC582',
      400: '#3BB563',
      500: '#2B9B4F',
      600: '#237E3F',
      700: '#1D6233',
      800: '#174C27',
      900: '#12391D',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        },
      }),
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.800',
      }),
      variants: {
        subtitle: (props) => ({
          color: props.colorMode === 'dark' ? 'gray.200' : 'gray.600',
        }),
      },
    },
    Text: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.700',
      }),
    },
    FormLabel: {
      baseStyle: (props) => ({
        color: props.colorMode === 'dark' ? 'gray.300' : 'gray.600',
      }),
    },
    Input: {
      variants: {
        outline: (props) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'gray.500' : 'gray.300',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px ${props.theme.colors.brand[500]}`,
            },
          },
        }),
      },
    },
    NumberInput: {
      variants: {
        outline: (props) => ({
          field: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
            borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
          },
        }),
      },
    },
    Table: {
      baseStyle: (props) => ({
        th: {
          color: props.colorMode === 'dark' ? 'gray.400' : 'gray.600',
        },
      }),
    },
    Alert: {
      variants: {
        warning: (props) => ({
          container: {
            bg: props.colorMode === 'dark' ? 'yellow.800' : 'yellow.100',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          },
        }),
      },
    },
  },
});

export default theme;