
var testthing;
if(window.isBanter){
BS.BanterScene.GetInstance().On("unity-loaded", ()=>{
  BS.BanterScene.GetInstance().TeleportTo({x: -6, y: 0.02, z: -7}, 0, true);
  console.log("setSceneSettings Loading...");
  const zettings = new BS.SceneSettings();
  zettings.EnableDevTools = false;
  zettings.EnableTeleport = false;
  zettings.EnableForceGrab = false;
  zettings.EnableSpiderMan = false;
  zettings.EnablePortals = false;
  zettings.EnableGuests = true;
  zettings.EnableQuaternionPose = false;
  zettings.EnableControllerExtras = true;
  zettings.EnableFriendPositionJoin = false;
  zettings.EnableDefaultTextures = true;
  zettings.EnableAvatars = true;
  zettings.MaxOccupancy = 30;
  zettings.RefreshRate = 72;
  zettings.ClippingPlane = new BS.Vector2(0.02, 1500);
  zettings.SpawnPoint = new BS.Vector4(-6, 0.02, -7, 180);
  zephiiscene.SetSettings(zettings);
});

const zephiiscene = BS.BanterScene.GetInstance();

async function zephiidrop() {
  const makeTriggerBox = async (pos, scale, color, callback) => {
      const box = new BS.GameObject();
      await box.AddComponent(new BS.BanterGeometry(BS.GeometryType.BoxGeometry));
      await box.AddComponent(new BS.BanterMaterial("Sprites/Diffuse", "", color));
      await box.AddComponent(new BS.BoxCollider(true));
      await box.AddComponent(new BS.BanterColliderEvents());
      // box.SetLayer(23);
      const transform = await box.AddComponent(new BS.Transform());
      transform.localScale = scale; transform.localPosition = pos;
      box.On("trigger-enter", (e) => { if (e.detail.user !== undefined) { testthing = e; callback(); }});
  }   

  let startTime = -1, duration = 0, isStarted = false;

  const textObject = new BS.GameObject();
  const scoreText = await textObject.AddComponent(new BS.BanterText("Score: ", new BS.Vector4(1,1,1,1), 1, 0, 1));
  const transform = await textObject.AddComponent(new BS.Transform());
  transform.localPosition = new BS.Vector3(-2,-312.8,-4); transform.localScale = new BS.Vector3(3, 3, 2);

  // Start Point
  makeTriggerBox(new BS.Vector3(-7.33,-9.4,-6.12), new BS.Vector3(80,1,80), new BS.Vector4(0,1,0,0), () => {
      if(!isStarted) { isStarted = true; startTime = new Date().getTime(); }
  });
  // Finish Point
  makeTriggerBox(new BS.Vector3(-2,-308.9,-4), new BS.Vector3(90,1,90), new BS.Vector4(0,0,0,0), () => {
      if(isStarted) { isStarted = false; duration = new Date().getTime() - startTime; setPublicSpaceProp(zephiiscene.localUser.name, duration); }
  });
var countervariable = 0;
    AframeInjection.addEventListener('spaceStateChange', async e => {countervariable++
      console.log(`Space State Listener.${countervariable}`);
        updateScoreBoardZ(); 
      e.detail.changes.forEach(change => { 
      console.log(change);})
    });
  
  function updateScoreBoardZ() { scoreText.text = "Score: ";
    let spacestatethings = zephiiscene.spaceState.public;
    // Convert the entries to an array, sort by value, and then format the output
    let sortedEntries = Object.entries(spacestatethings).sort((a, b) => a[1] - b[1]);
    sortedEntries.forEach(([key, value]) => {
      if (value < 999999 && value > 10000) {scoreText.text += "\n" + key.substring(0, 19) + ": " + value / 1000;}
    });              
  };
updateScoreBoardZ();
};

let firstdroprun = true; let waitingforunity = true;
if (waitingforunity) { const zscreeninterval = setInterval(function() {
  if (zephiiscene.unityLoaded) { waitingforunity = false; clearInterval(zscreeninterval);
    if (firstdroprun) { firstdroprun = false; zephiidrop(); }; };
}, 500); };
   // setPublicSpaceProp('Fire', '23183828');  //THIS IS WHAT YOU ENTER IN CONSOLE
};
