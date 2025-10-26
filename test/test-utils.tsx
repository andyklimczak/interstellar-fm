import { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';

import { RadioContext } from '@/contexts/radio-context';
import { Station } from '@/types/radio';

type PartialRadioContext = Partial<React.ContextType<typeof RadioContext>>;

const createBaseContextValue = (
  overrides: PartialRadioContext = {},
): React.ContextType<typeof RadioContext> => ({
  currentStation: null,
  savedStations: [],
  recentStations: [],
  isHydrated: true,
  status: 'idle',
  volume: 1,
  playStation: jest.fn(),
  togglePlayPause: jest.fn(),
  stop: jest.fn(),
  setVolume: jest.fn(),
  saveStation: jest.fn(),
  removeStation: jest.fn(),
  isStationSaved: jest.fn(() => false),
  isBusy: false,
  ...overrides,
});

export const renderWithRadioContext = (
  ui: ReactElement,
  overrides: PartialRadioContext = {},
) => {
  const value = createBaseContextValue(overrides);
  return render(
    <NavigationContainer>
      <RadioContext.Provider value={value}>{ui}</RadioContext.Provider>
    </NavigationContainer>,
  );
};

export const createStation = (overrides: Partial<Station> = {}): Station => ({
  stationuuid: 'station-uuid',
  name: 'Sample Station',
  url: 'https://example.com/stream',
  urlResolved: 'https://example.com/stream',
  favicon: null,
  country: 'USA',
  countryCode: 'US',
  state: null,
  tags: 'jazz',
  bitrate: 128,
  homepage: null,
  language: 'English',
  codec: 'MP3',
  votes: 0,
  clickCount: 0,
  ...overrides,
});
