import energy from "./energy";
import weather from "./weather";

const resolvers = {
  Query: {
    weather: weather,
    energy: energy
  },
};

export default resolvers
