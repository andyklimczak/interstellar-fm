import { RecentStationsTab } from '@/components/radio/RecentStationsTab';
import { createStation, renderWithRadioContext } from '@/test/test-utils';

describe('RecentStationsTab', () => {
  it('shows loading indicator while hydration is pending', () => {
    const { getByText } = renderWithRadioContext(<RecentStationsTab />, {
      isHydrated: false,
    });

    expect(getByText('Loading history…')).toBeOnTheScreen();
  });

  it('renders recent stations when available', () => {
    const stations = [
      createStation({ stationuuid: 'r1', name: 'Deep Space FM' }),
      createStation({ stationuuid: 'r2', name: 'Cosmic Jazz' }),
    ];

    const { getByText } = renderWithRadioContext(<RecentStationsTab />, {
      recentStations: stations,
      isStationSaved: (uuid: string) => stations.some((station) => station.stationuuid === uuid),
    });

    expect(getByText('Deep Space FM')).toBeOnTheScreen();
    expect(getByText('Cosmic Jazz')).toBeOnTheScreen();
  });

  it('renders an empty state when no stations have been played', () => {
    const { getByText } = renderWithRadioContext(<RecentStationsTab />, {
      recentStations: [],
    });

    expect(getByText('No stations yet')).toBeOnTheScreen();
  });
});
