import { useContext, createContext } from "react";
import { v4 as uuidv4 } from "uuid";

import { speedInterface } from "../interfaces/speedInterfaces";

import useLocalStorageState from "use-local-storage-state";

export interface veesSpeedDataInterface {
  local: boolean; // local only
  localSpeed: {
    id: string;
    name: string;
    kmph: number;
    mph: number;
  };
  externalSpeed: null | speedInterface;
  // set only if externalSpeed comes from a source that has
  // no fields like user feedback and bookmark (not even null)
  externalSpeedBasic?: true;
}

const VeesSpeedDataContext = createContext<any | undefined>(undefined);

export function useVeesSpeedData() {
  return useContext(VeesSpeedDataContext);
}

export function VeesSpeedDataProvider({ children }: { children: any }) {
  const indeciesArray: Array<number> = getRandomUniqueIndecies(
    placeholderVeesSpeedData.length - 1,
    5,
  );
  const defaultVeesSeedData = indeciesArray.map((i: number) => {
    return placeholderVeesSpeedData[i];
  });

  const [veesSpeedData, setVeesSpeedData] = useLocalStorageState<
    veesSpeedDataInterface[]
  >("veesSpeedData", {
    defaultValue: defaultVeesSeedData,
  });

  return (
    <VeesSpeedDataContext.Provider value={[veesSpeedData, setVeesSpeedData]}>
      {children}
    </VeesSpeedDataContext.Provider>
  );
}

function getRandomUniqueIndecies(max: number, count: number): number[] {
  const uniqueIndecies: Set<number> = new Set();

  while (uniqueIndecies.size < count) {
    const randomNumber = Math.floor(Math.random() * (max + 1));
    uniqueIndecies.add(randomNumber);
  }

  return Array.from(uniqueIndecies);
}

const placeholderVeesSpeedData: veesSpeedDataInterface[] = [
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Mitsubishi 3000GT",
      kmph: 257.5,
      mph: 160.0,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Earth",
      kmph: 107226.0,
      mph: 66627.1475,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Lockheed Martin F-22 Raptor",
      kmph: 2414.0,
      mph: 1500.0,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Cheetah",
      kmph: 100,
      mph: 62.1371,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Formula 1 Car",
      kmph: 370,
      mph: 230.16,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Light",
      kmph: 299792.458,
      mph: 186282.397,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Peregrine Falcon",
      kmph: 389,
      mph: 241.97,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Bullet Train",
      kmph: 320,
      mph: 198.84,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Speed of Sound",
      kmph: 1235,
      mph: 767.29,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "International Space Station (ISS)",
      kmph: 27700,
      mph: 17241.59,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Killer Whale (Record Holder, Short Burst)",
      kmph: 55.5,
      mph: 34.49,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Galápagos Tortoise",
      kmph: 0.3,
      mph: 0.18,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Bugatti Chiron",
      kmph: 490,
      mph: 304.5,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Boeing 747",
      kmph: 988,
      mph: 614.65,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Ford Model T",
      kmph: 45,
      mph: 27.96,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Royal Caribbean's Symphony of the Seas",
      kmph: 22.5,
      mph: 13.98,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Dodge Tomahawk",
      kmph: 560,
      mph: 348.33,
    },
    externalSpeed: null,
  },
  {
    local: true,
    localSpeed: {
      id: uuidv4(),
      name: "Usain Bolt (World Record, 100m)",
      kmph: 37.58,
      mph: 23.35,
    },
    externalSpeed: null,
  },
];
