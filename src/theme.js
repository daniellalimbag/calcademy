import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#F0FFF4',
      100: '#C6F6D5',
      200: '#9AE6B4',
      300: '#68D391',
      400: '#48BB78',
      500: '#38A169',
      600: '#2F855A',
      700: '#276749',
      800: '#22543D',
      900: '#1C4532',
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
              borderColor: 'green.500',
              boxShadow: `0 0 0 1px ${props.theme.colors.green[500]}`,
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