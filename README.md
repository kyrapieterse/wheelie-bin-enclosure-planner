# Wheelie-bin enclosure planner

Check a row of bins, raised lids, gate swing and a straight pull-out path against your available space. This free browser tool works offline and processes files on your device.

## Run locally

Download the repository as a ZIP, extract it and open `index.html` in a modern browser. No build step, account or API key is required.

## Try the example

The example places two 600 mm bins inside a 1,500 mm enclosure. Both have a straight path through the 1,400 mm gate. Reduce the clear space in front to 800 mm and check the gate swing result. Reducing headroom below 1,600 mm separately flags the raised lids.

## How it works

Bins are centred side by side. Gate offset is measured from the enclosure’s left side. The single gate leaf opens outward through 90°. The plan checks alignment and front space for each bin independently, plus the height you measured with its lid raised. Turning manoeuvres, hinges and protruding hardware need a site check.

For related examples and project guidance, see the [Tint & Screen wheelie-bin cover guide](https://tintandscreen.co.za/architectural-screens/wheelie-bin-covers/).

## License

The code and original sample geometry are available under the [MIT License](LICENSE). The Tint & Screen name and logo identify the publisher and are outside the code license. Artwork and photos you load keep their own rights.
