// Handle price range slider change
var lowerSlider = document.querySelector('#lower');
var upperSlider = document.querySelector('#upper');

var inputOne = document.querySelector('#one');
var inputTwo = document.querySelector('#two');

inputOne.value = lowerSlider.value;
inputTwo.value = upperSlider.value;

var lowerVal = parseInt(lowerSlider.value);
var upperVal = parseInt(upperSlider.value);

var debounceTimer; // Variable to store the debounce timer ID

upperSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);

    if (upperVal < lowerVal + 100) {
        lowerSlider.value = upperVal - 100;
        if (lowerVal == lowerSlider.min) {
            upperSlider.value = 100;
        }
    }

    // Update UI
    inputTwo.value = upperSlider.value;

    // Perform filtering with updated price range after a debounce delay
    debouncePerformFiltering();
};

lowerSlider.oninput = function () {
    lowerVal = parseInt(lowerSlider.value);
    upperVal = parseInt(upperSlider.value);
    if (lowerVal > upperVal - 100) {
        upperSlider.value = lowerVal + 100;
        if (upperVal == upperSlider.max) {
            lowerSlider.value = parseInt(upperSlider.max) - 100;
        }
    }

    // Update UI
    inputOne.value = lowerSlider.value;

    // Perform filtering with updated price range after a debounce delay
    debouncePerformFiltering();
};

function debouncePerformFiltering() {
    // Clear the previous debounce timer
    clearTimeout(debounceTimer);

    // Set a new debounce timer to delay the filtering action
    debounceTimer = setTimeout(function () {
        var minPrice = lowerSlider.value;
        var maxPrice = upperSlider.value;

        handleProductPaginationClick(1, null, null, minPrice, maxPrice);
    }, 300); // Adjust the debounce delay as needed (e.g., 300 milliseconds)
}
