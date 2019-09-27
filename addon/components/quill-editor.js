import Quill from "quill";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { getOwner } from "@ember/application";
import { htmlSafe } from "@ember/string";

import layout from "../templates/components/quill-editor";

export default Component.extend({
  layout,
  editor: null,

  textChange() {},

  selectionChange() {},

  options: computed(function() {
    return { theme: "snow" };
  }),

  safeValue: computed("value", function() {
    return htmlSafe(this.getWithDefault("value", "\n"));
  }),

  fastboot: computed(function() {
    return getOwner(this).lookup("service:fastboot");
  }),

  didInsertElement() {
    // Don"t instantiate Quill if fastboot is detected
    if (this.get("fastboot.isFastBoot")) {
      return;
    }

    const editor = new Quill(this.element, this.get("options"));

    editor.on("text-change", (delta, oldDelta, source) => {
      this.get("textChange")(
        this.get("editor"),
        delta,
        oldDelta,
        source
      );
    });

    editor.on("selection-change", (delta, oldDelta, source) => {
      this.get("selectionChange")(
        this.get("editor"),
        delta,
        oldDelta,
        source
      );
    });

    this.set("editor", editor);
  },

  didUpdateAttrs() {
    // This is needed in circumstances likes forms where the value
    // may get reset to null and the editor isn't destroyed
    // because the component isn't torn down
    if (this.get("editor")) {
      if (this.editor.root.innerHTML !== this.value) {
        this.get("editor").setText(this.value || "\n", "silent");
      }
    }
  }
});
