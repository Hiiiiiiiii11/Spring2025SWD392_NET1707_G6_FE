
const mapResponse = (label, selectedOption) => {
  

  if (label === 'OILINESS') {
    switch (selectedOption) {
      case 'Not oily at all':
        return 'not_oily';
      case 'Slightly oily':
        return 'slightly_oily';
      case 'Moderately oily':
        return 'oily';
      case 'Very oily':
        return 'very_oily';
      default:
        return selectedOption;
    }
  }
  
  // Map cho độ khô (DRYNESS)
  if (label === 'DRYNESS') {
    switch (selectedOption) {
      case 'Not dry at all':
        return 'not_dry';
      case 'Slightly dry':
        return 'slightly_dry';
      case 'Dry':
        return 'dry';
      case 'Very dry':
        return 'very_dry';
      default:
        return selectedOption;
    }
  }
  
  // Map cho độ nhạy cảm (SENSITIVITY)
  if (label === 'SENSITIVITY') {
    switch (selectedOption) {
      case 'Not sensitive':
        return 'none';
      case 'Slightly sensitive':
        return 'low';
      case 'Moderately sensitive':
        return 'medium';
      case 'Very sensitive':
        return 'high';
      default:
        return selectedOption;
    }
  }
  
  // Map cho mụn (ACNE)
  if (label === 'ACNE') {
    switch (selectedOption) {
      case 'No acne':
        return 'no';
      case 'Occasional breakouts':
        return 'occasionally';
      case 'Regular breakouts':
        return 'yes';
      case 'Severe acne':
        return 'severe';
      default:
        return selectedOption;
    }
  }
  
  // Map cho lão hóa (AGING)
  if (label === 'AGING') {
    switch (selectedOption) {
      case 'No signs of aging':
        return 'no';
      case 'Minimal signs of aging':
        return 'slightly';
      case 'Moderate signs of aging':
        return 'concerned';
      case 'Significant signs of aging':
        return 'visible';
      default:
        return selectedOption;
    }
  }
  
  // Map cho tăng sắc tố (HYPERPIGMENTATION)
  if (label === 'HYPERPIGMENTATION') {
    switch (selectedOption) {
      case 'No hyperpigmentation':
        return 'no';
      case 'Slight hyperpigmentation':
        return 'slightly';
      case 'Noticeable hyperpigmentation':
        return 'noticeable';
      case 'Severe hyperpigmentation':
        return 'severe';
      default:
        return selectedOption;
    }
  }
  
  // Map cho đỏ da (REDNESS)
  if (label === 'REDNESS') {
    switch (selectedOption) {
      case 'No redness':
        return 'no';
      case 'Occasional redness':
        return 'rarely';
      case 'Frequent redness':
        return 'frequent';
      case 'Persistent redness':
        return 'persistent';
      default:
        return selectedOption;
    }
  }
  
  // Trả về giá trị gốc nếu không có mapping nào phù hợp
  return selectedOption;
};

export default mapResponse;