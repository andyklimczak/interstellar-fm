import '@testing-library/jest-native/extend-expect';

jest.mock('expo-audio', () => {
  const listeners = new Set();

  const createAudioPlayer = jest.fn(() => {
    let playing = false;
    let volume = 1;
    const subscription = {
      remove: jest.fn(() => {
        listeners.delete(subscription);
      }),
    };

    return {
      play: jest.fn(() => {
        playing = true;
      }),
      pause: jest.fn(() => {
        playing = false;
      }),
      replace: jest.fn(),
      remove: jest.fn(),
      addListener: jest.fn((event, handler) => {
        if (event === 'playbackStatusUpdate' && typeof handler === 'function') {
          listeners.add(subscription);
        }
        return subscription;
      }),
      get currentStatus() {
        return {
          isLoaded: true,
          playing,
          didJustFinish: false,
        };
      },
      get volume() {
        return volume;
      },
      set volume(value) {
        volume = value;
      },
    };
  });

  return {
    createAudioPlayer,
    setAudioModeAsync: jest.fn(),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const MockIcon = ({ name, ...rest }) =>
    React.createElement(
      Text,
      {
        accessibilityRole: 'image',
        ...rest,
      },
      name,
    );

  return {
    Ionicons: MockIcon,
  };
});
