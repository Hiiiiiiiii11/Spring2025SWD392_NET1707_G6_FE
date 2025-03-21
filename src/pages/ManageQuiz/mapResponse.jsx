
const oilinessMapping = {
  'Oily': 'oily',
  'Very Oily': 'very_oily',
  'Normal': 'normal',
  'Dry': 'not_oily',
  'Oily and Shiny': 'oily',
  'Yes, Oiliness': 'oily',
  'Excessive': 'excessive',
  'Yes': 'yes'
};

// Map responses for dryness label
const drynessMapping = {
  'Dry': 'dry',
  'Very Dry': 'very_dry',
  'Normal': 'normal',
  'Oily': 'not_dry',
  'Dehydrated': 'dry',
  'Hydrated': 'normal',
  'Flaky': 'dry',
  'Rough': 'dry',
  'Yes, Dryness': 'dry',
  'Persistent': 'persistent',
  'Yes': 'yes'
};

// Map responses for sensitivity label
const sensitivityMapping = {
  'Yes': 'high',
  'No': 'low',
  'Sometimes': 'medium',
  'High': 'high'
};

// Map responses for common yes/no/sometimes questions
const yesNoMapping = {
  'Yes': 'yes',
  'No': 'no',
  'Occasionally': 'occasional',
  'Sometimes': 'occasional',
  'Frequently': 'frequent',
  'Visible': 'visible',
  'Concerned': 'concerned',
  'Noticeable': 'noticeable'
};

// Map special case responses
const specialCaseMapping = {
  'Both Oiliness and Dryness': 'combination',
  'Smooth': 'normal'
};

const mapResponse = (label, answer) => {
  if (!label || !answer) return answer ? answer.toLowerCase().replace(/\s+/g, '_') : '';

  // First check label-specific mappings
  switch (label) {
    case 'oiliness':
      return oilinessMapping[answer] || answer.toLowerCase().replace(/\s+/g, '_');

    case 'dryness':
      return drynessMapping[answer] || answer.toLowerCase().replace(/\s+/g, '_');

    case 'sensitivity':
      return sensitivityMapping[answer] || answer.toLowerCase().replace(/\s+/g, '_');

    case 'acne':
    case 'redness':
    case 'hyperpigmentation':
    case 'aging':
      return yesNoMapping[answer] || answer.toLowerCase().replace(/\s+/g, '_');
  }

  // Then check special case mappings
  if (specialCaseMapping[answer]) {
    return specialCaseMapping[answer];
  }

  // Default: convert to lowercase and replace spaces with underscores
  return answer.toLowerCase().replace(/\s+/g, '_');
};

export default mapResponse;