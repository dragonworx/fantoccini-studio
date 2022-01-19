<style lang="scss">
  .layout {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    margin-top: 10px;
  }
</style>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Label from "../../gui/components/Label.svelte";
  import Form from "../../gui/components/Form.svelte";
  import TextField from "../../gui/components/TextField.svelte";
  import Window from "../../gui/components/Window.svelte";
  import DialogButtons from "../../gui/components/DialogButtons.svelte";
  import app from "../application";

  export let isOpen: boolean = false;

  $: state = {
    title: "Untitled",
  };

  $: screenWidth = app.screenWidth;
  $: screenHeight = app.screenHeight;
  $: windowWidth = 300;
  $: windowHeight = 120;

  const dispatch = createEventDispatcher();

  const onClose = () => {
    dispatch("cancel");
  };

  const onAccept = () => {};
</script>

<main>
  <Window
    id="newProject"
    {isOpen}
    title="New Project"
    x={screenWidth * 0.5 - windowWidth * 0.5}
    y={screenHeight * 0.5 - windowHeight * 0.5}
    width={windowWidth}
    height={windowHeight}
    canMaximise={false}
    canMinimise={false}
    on:close={onClose}>
    <div class="layout">
      <Form labelSize={50}>
        <Label text="Title:" /><TextField bind:value={state.title} />
      </Form>
      <DialogButtons
        acceptText="Create Project"
        on:accept={onAccept}
        on:cancel />
    </div>
  </Window>
</main>
