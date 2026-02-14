#target photoshop
app.bringToFront();

/**
 * Générateur de flyers pro pour Photoshop (ExtendScript).
 *
 * Utilisation :
 * 1) Fichier > Scripts > Parcourir...
 * 2) Sélectionnez ce script.
 * 3) Choisissez un fichier JSON conforme au modèle examples/flyer.sample.json.
 */

function mmToPx(mm, dpi) {
  return (mm / 25.4) * dpi;
}

function ensureColorRGB(r, g, b) {
  var color = new SolidColor();
  color.rgb.red = r;
  color.rgb.green = g;
  color.rgb.blue = b;
  return color;
}

function createDocument(config) {
  var widthPx = mmToPx(config.document.widthMm, config.document.dpi);
  var heightPx = mmToPx(config.document.heightMm, config.document.dpi);

  var doc = app.documents.add(
    widthPx,
    heightPx,
    config.document.dpi,
    config.document.name,
    NewDocumentMode.RGB,
    DocumentFill.WHITE
  );

  return doc;
}

function addBackground(doc, config) {
  var bg = doc.artLayers.add();
  bg.name = "Fond";
  bg.move(doc, ElementPlacement.PLACEATEND);

  var color = ensureColorRGB(
    config.colors.background[0],
    config.colors.background[1],
    config.colors.background[2]
  );

  doc.selection.selectAll();
  doc.selection.fill(color);
  doc.selection.deselect();
}

function addTextLayer(doc, content, fontName, sizePt, colorRGB, x, y, justification, layerName) {
  var textLayer = doc.artLayers.add();
  textLayer.kind = LayerKind.TEXT;
  textLayer.name = layerName;

  var textItem = textLayer.textItem;
  textItem.contents = content;
  textItem.position = [x, y];
  textItem.size = sizePt;
  textItem.font = fontName;
  textItem.color = ensureColorRGB(colorRGB[0], colorRGB[1], colorRGB[2]);

  if (justification === "center") {
    textItem.justification = Justification.CENTER;
  } else if (justification === "right") {
    textItem.justification = Justification.RIGHT;
  } else {
    textItem.justification = Justification.LEFT;
  }

  return textLayer;
}

function placeImageCentered(doc, imagePath, topOffsetPx, targetWidthPercent) {
  var fileRef = new File(imagePath);
  if (!fileRef.exists) {
    throw new Error("Image introuvable: " + imagePath);
  }

  var placeAction = stringIDToTypeID("placedLayerReplaceContents");
  var desc = new ActionDescriptor();
  desc.putPath(charIDToTypeID("null"), fileRef);
  executeAction(placeAction, desc, DialogModes.NO);

  var layer = doc.activeLayer;
  layer.name = "Visuel principal";

  var bounds = layer.bounds;
  var currentWidth = bounds[2].as("px") - bounds[0].as("px");
  var targetWidth = doc.width.as("px") * (targetWidthPercent / 100);
  var scale = (targetWidth / currentWidth) * 100;

  layer.resize(scale, scale, AnchorPosition.MIDDLECENTER);

  bounds = layer.bounds;
  var layerWidth = bounds[2].as("px") - bounds[0].as("px");
  var layerHeight = bounds[3].as("px") - bounds[1].as("px");

  var moveX = (doc.width.as("px") - layerWidth) / 2 - bounds[0].as("px");
  var moveY = topOffsetPx - bounds[1].as("px");

  layer.translate(moveX, moveY);
}

function addFooterBar(doc, config) {
  var bar = doc.artLayers.add();
  bar.name = "Barre contact";

  var docW = doc.width.as("px");
  var docH = doc.height.as("px");
  var barHeight = mmToPx(config.footer.heightMm, config.document.dpi);

  doc.selection.select([
    [0, docH - barHeight],
    [docW, docH - barHeight],
    [docW, docH],
    [0, docH]
  ]);

  var color = ensureColorRGB(
    config.colors.footer[0],
    config.colors.footer[1],
    config.colors.footer[2]
  );

  doc.selection.fill(color);
  doc.selection.deselect();
}

function loadJSONConfig(jsonFile) {
  jsonFile.encoding = "UTF8";
  if (!jsonFile.open("r")) {
    throw new Error("Impossible d'ouvrir le fichier JSON.");
  }

  var raw = jsonFile.read();
  jsonFile.close();

  return JSON.parse(raw);
}

function generateFlyer(config) {
  var doc = createDocument(config);
  addBackground(doc, config);

  var marginPx = mmToPx(config.layout.marginMm, config.document.dpi);

  addTextLayer(
    doc,
    config.content.headline,
    config.typography.headline.font,
    config.typography.headline.sizePt,
    config.colors.headline,
    marginPx,
    marginPx + 80,
    "left",
    "Headline"
  );

  addTextLayer(
    doc,
    config.content.subheadline,
    config.typography.subheadline.font,
    config.typography.subheadline.sizePt,
    config.colors.subheadline,
    marginPx,
    marginPx + 180,
    "left",
    "Subheadline"
  );

  if (config.content.mainImagePath && config.content.mainImagePath.length > 0) {
    placeImageCentered(
      doc,
      config.content.mainImagePath,
      mmToPx(config.layout.imageTopMm, config.document.dpi),
      config.layout.imageWidthPercent
    );
  }

  addFooterBar(doc, config);

  var footerY = doc.height.as("px") - mmToPx(config.footer.heightMm, config.document.dpi) / 2;
  addTextLayer(
    doc,
    config.content.contact,
    config.typography.footer.font,
    config.typography.footer.sizePt,
    config.colors.footerText,
    marginPx,
    footerY,
    "left",
    "Contact"
  );

  alert("Flyer généré avec succès : " + config.document.name);
}

function main() {
  if (!documents.length) {
    // no-op: le script crée son propre document
  }

  var jsonFile = File.openDialog("Sélectionnez le fichier JSON de configuration", "*.json");
  if (!jsonFile) {
    alert("Aucun fichier sélectionné.");
    return;
  }

  try {
    var config = loadJSONConfig(jsonFile);
    generateFlyer(config);
  } catch (err) {
    alert("Erreur: " + err.message);
  }
}

main();
