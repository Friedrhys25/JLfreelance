export const BARBER_SPECIALTIES = ["Haircut", "Hair Color", "Hair Treatment"] as const;

export const getServiceCategory = (serviceName: string) => {
  const lowered = serviceName.toLowerCase();

  if (lowered.includes("color")) {
    return "Hair Color";
  }

  if (lowered.includes("treatment")) {
    return "Hair Treatment";
  }

  return "Haircut";
};
