import { renderWithRadioContext, createStation } from '@/test/test-utils';
import { SavedStationsTab } from '@/components/radio/SavedStationsTab';

describe('SavedStationsTab', () => {
  it('shows loading indicator while hydration is pending', () => {
    const { getByText } = renderWithRadioContext(<SavedStationsTab />, {
      isHydrated: false,
    });

    expect(getByText('Loading saved stations…')).toBeOnTheScreen();
  });

  it('renders saved stations when hydrated', () => {
    const stations = [
      createStation({ stationuuid: '1', name: 'Lofi Beats' }),
      createStation({ stationuuid: '2', name: 'Classical FM' }),
    ];

    const { getByText } = renderWithRadioContext(<SavedStationsTab />, {
      savedStations: stations,
      isStationSaved: (uuid: string) => stations.some((station) => station.stationuuid === uuid),
    });

    expect(getByText('Lofi Beats')).toBeOnTheScreen();
    expect(getByText('Classical FM')).toBeOnTheScreen();
  });
});
