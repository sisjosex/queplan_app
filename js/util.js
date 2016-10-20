
function ImageLoader(preview, image) {

    var self = this;

    self.image = image;
    self.preview = preview;

    self.image.src = preview.attr('src');

    var outerWidth = self.preview.width();
    var outerHeight = self.preview.height();

    self.image.onload = function() {

        self.preview.css('background-image', "url('" + self.image.src + "')");
        self.preview.css('background-repeat', "no-repeat");
        self.preview.css('background-position', "center center");

        var width = image.width;
        var height = image.height;
        var factor = 1;

        if (outerWidth > width) {
            factor = outerWidth / width;
            width = width * factor;
            height = height * factor;
        }

        if (outerHeight > height) {

            factor = (outerHeight) / height;
            width = width * factor;
            height = height * factor;
        }

        if (outerWidth < width) {
            factor = outerHeight / height;
            width = width * factor;
            height = outerHeight;

            if (outerWidth - width > 0) {
                factor = outerWidth / width;
                width = outerWidth;
                height = height * factor;
            }


        } else if (outerHeight < height) {
            factor = outerWidth / width;
            width = outerWidth;
            height = height * factor;

            if (outerHeight - height > 0) {
                factor = outerHeight / height;
                height = outerHeight;
                width = width * factor;
            }
        }

        width = parseInt(width + "") + 4;
        height = parseInt(height + "");

        //self.preview.css('background-size', (width) + "px" + " " + (height) + "px");
        //self.preview.css('background-size', 'cover');

        self.preview.addClass('loaded');
    }
}