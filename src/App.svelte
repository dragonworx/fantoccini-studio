<style lang="scss">
  main {
    box-sizing: border-box;
    position: relative;
    height: 100%;
    display: flex;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  #debug {
    position: fixed;
    right: 5px;
    bottom: 5px;
    font-size: 10px;
    color: white;
  }
</style>

<script lang="ts">
  import app, { AppEvent, menuBar } from "./app/application";
  import Panel from "./gui/components/Panel.svelte";
  import NewProjectWindow from "./app/dialogs/NewProject.svelte";

  app.on(AppEvent.ShowNewDialog, () => {
    state.dialog.new.isOpen = true;
  });

  $: state = {
    dialog: {
      new: {
        isOpen: false,
      },
    },
  };
</script>

<main>
  <Panel {menuBar} />
  <NewProjectWindow
    isOpen={state.dialog.new.isOpen}
    on:close={() => (state.dialog.new.isOpen = false)} />
  <div id="debug">{Date.now()}</div>
</main>
